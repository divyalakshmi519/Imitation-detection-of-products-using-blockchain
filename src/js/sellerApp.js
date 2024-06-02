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

        var sellerName = document.getElementById('SellerName').value;
        var sellerBrand = document.getElementById('SellerBrand').value;
        var sellerCode = document.getElementById('SellerCode').value;
        var sellerPhoneNumber = document.getElementById('SellerPhoneNumber').value;
        var sellerManager = document.getElementById('SellerManager').value;
        var sellerAddress = document.getElementById('SellerAddress').value;
        var ManufacturerId = document.getElementById('ManufacturerId').value;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            console.log(accounts);
            var account = accounts[0];

            App.contracts.product.deployed().then(function(instance) {
                productInstance = instance;
                return productInstance.addSeller(
                    web3.fromAscii(ManufacturerId),
                    web3.fromAscii(sellerName),
                    web3.fromAscii(sellerBrand),
                    web3.fromAscii(sellerCode),
                    sellerPhoneNumber,
                    web3.fromAscii(sellerManager),
                    web3.fromAscii(sellerAddress),
                    { from: account }
                );
            }).then(function(result) {
                console.log(result);
                window.location.reload();
                document.getElementById('SellerName').value = '';
                document.getElementById('SellerBrand').value = '';
                document.getElementById('SellerCode').value = '';
                document.getElementById('SellerPhoneNumber').value = '';
                document.getElementById('SellerManager').value = '';
                document.getElementById('SellerAddress').value = '';
                document.getElementById('ManufacturerId').value = '';

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