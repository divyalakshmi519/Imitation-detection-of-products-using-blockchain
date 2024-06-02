App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: function() {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            // Request account access if needed
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    // Accounts now exposed
                })
                .catch((error) => {
                    console.error(error);
                });
        } else if (window.web3) {
            // Legacy dApp browsers
            App.web3Provider = window.web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to localhost
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {
        $.getJSON('product.json', function(data) {
            var productArtifact = data;
            App.contracts.product = TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-register', App.registerProduct);
    },

    registerProduct: function(event) {
        event.preventDefault();

        var productInstance;

        var productSN = document.getElementById('productSN').value;
        var consumerCode = document.getElementById('consumerCode').value;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            console.log(accounts);
            var account = accounts[0];

            App.contracts.product.deployed().then(function(instance) {
                productInstance = instance;
                return productInstance.sellerSellProduct(
                    web3.fromAscii(productSN),
                    web3.fromAscii(consumerCode),
                    { from: account }
                );
            }).then(function(result) {
                // console.log(result);
                window.location.reload();
                document.getElementById('productSN').value = '';
                document.getElementById('consumerCode').value = '';
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});