import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Domain = ({ domain, godaddyWeb3, provider, id }) => {
  const [owner, setOwner] = useState(null);
  const [hasSold, setHasSold] = useState(false);

  const getOwner = async () => {
    if (domain.isOwned || hasSold) {
      const owner = await godaddyWeb3.ownerOf(id);
      setOwner(owner);
    }
  };

  const buyHandler = async () => {
    // buyHandler
    const signer = await provider.getSigner();
    let transaction = await godaddyWeb3
      .connect(signer)
      .mint(id, { value: domain.cost });
    await transaction.wait();

    setHasSold(true);
  };

  useEffect(() => {
    getOwner();
  }, [hasSold]);

  const toEth = (domain) => {
    return ethers.utils.formatUnits(domain.cost.toString(), "ether");
  };
  return (
    <div className="card">
      <div className="card__info">
        <h3>
          {domain.isOwned || owner ? (
            <del>{domain.name}</del>
          ) : (
            <>{domain.name}</>
          )}
        </h3>

        <p>
          {domain.isOwned || owner ? (
            <>
              <small>
                Owned by:
                <br />
                <span>
                  {owner && owner.slice(0, 6) + "..." + owner.slice(38, 42)}
                </span>
              </small>
            </>
          ) : (
            <>
              <strong>{toEth(domain)}</strong>
              ETH
            </>
          )}
        </p>
      </div>

      {!(domain.isOwned || owner) && (
        <button
          type="button"
          className="card__button"
          onClick={() => buyHandler()}
        >
          Buy It
        </button>
      )}
    </div>
  );
};

export default Domain;
