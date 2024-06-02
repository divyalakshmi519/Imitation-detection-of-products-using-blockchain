App = {
    web3Provider: null,
    contracts: {},

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
        $(document).on('click', '.btn-register', App.getData);
    },

    getData: function(event) {
        event.preventDefault();
        var sellerCode = document.getElementById('sellerCode').value;

        var productInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.product.deployed().then(function(instance) {
                productInstance = instance;
                return productInstance.queryProductsList(web3.fromAscii(sellerCode), { from: account });
            }).then(function(result) {
                var productIds = [];
                var productSNs = [];
                var productNames = [];
                var productBrands = [];
                var productPrices = [];
                var productStatus = [];

                for (var k = 0; k < result[0].length; k++) {
                    productIds[k] = result[0][k];
                }

                for (var k = 0; k < result[1].length; k++) {
                    productSNs[k] = web3.toAscii(result[1][k]);
                }

                for (var k = 0; k < result[2].length; k++) {
                    productNames[k] = web3.toAscii(result[2][k]);
                }

                for (var k = 0; k < result[3].length; k++) {
                    productBrands[k] = web3.toAscii(result[3][k]);
                }

                for (var k = 0; k < result[4].length; k++) {
                    productPrices[k] = result[4][k];
                }

                for (var k = 0; k < result[5].length; k++) {
                    productStatus[k] = web3.toAscii(result[5][k]);
                }

                var t = "";
                document.getElementById('logdata').innerHTML = t;
                for (var i = 0; i < result[0].length; i++) {
                    var temptr = "<td>" + productPrices[i] + "</td>";
                    if (temptr === "<td>0</td>") {
                        break;
                    }

                    var tr = "<tr>";
                    tr += "<td>" + productIds[i] + "</td>";
                    tr += "<td>" + productSNs[i] + "</td>";
                    tr += "<td>" + productNames[i] + "</td>";
                    tr += "<td>" + productBrands[i] + "</td>";
                    tr += "<td>" + productPrices[i] + "</td>";
                    tr += "<td>" + productStatus[i] + "</td>";
                    tr += "</tr>";
                    t += tr;
                }
                document.getElementById('logdata').innerHTML += t;
                document.getElementById('add').innerHTML = account;
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