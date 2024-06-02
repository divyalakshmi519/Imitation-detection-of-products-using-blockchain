const HDWalletProvider = require('@truffle/hdwallet-provider');



module.exports = {

  networks: { 
    development: {
    host: "localhost",     // Localhost (default: none)
    port: 7545,            // Standard Ethereum port (default: none)
    network_id: "*",       // Any network (default: none)
    }
    
  },

  mocha: {
    
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.12",    // Fetch exact version from solc-bin (default: truffle's version)
     
    }
  },

};
