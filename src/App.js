import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Domain from "./components/Domain";

// ABIs
import GodaddyWeb3 from "./abis/GodaddyWeb3.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [godaddyWeb3, setGodaddyWeb3] = useState(null);
  const [maxSupply, setMaxSupply] = useState(null);
  const [domains, setDomains] = useState([]);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();

    const godaddyWeb3 = new ethers.Contract(
      config[network.chainId].GodaddyWeb3.address,
      GodaddyWeb3,
      provider
    );
    setGodaddyWeb3(godaddyWeb3);

    const maxSupply = await godaddyWeb3.maxSupply();
    console.log(maxSupply.toString());
    setMaxSupply(maxSupply);

    const domains = [];
    for (var i = 1; i <= maxSupply; i++) {
      const domain = await godaddyWeb3.getDomain(i);
      domains.push(domain);
    }
    console.log(domains);
    setDomains(domains);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className="cards__section">
        <h2 className="cards__title">
          Turn your small business into a big brand.
        </h2>
        <hr />

        <div className="cards">
          {domains.map((domain, index) => (
            <Domain
              domain={domain}
              godaddyWeb3={godaddyWeb3}
              provider={provider}
              id={index + 1}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
