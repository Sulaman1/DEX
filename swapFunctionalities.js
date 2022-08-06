
async function trySwap() {
    let address = Moralis.User.current().get("ethAddress");
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
    if (currentTrade.from.symbol !== "ETH") {
        const allowance = await Moralis.Plugins.oneInch.hasAllowance({
            chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
            fromTokenAddress: currentTrade.from.address, // The token you want to swap
            fromAddress: address, // Your wallet address
            amount: amount,
        });
        console.log(allowance);
        if (!allowance) {
            await Moralis.Plugins.oneInch.approve({
                chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
                tokenAddress: currentTrade.from.address, // The token you want to swap
                fromAddress: address, // Your wallet address
            });
        }
    }
    try {
        let receipt = await doSwap(address, amount);
        alert("Swap Complete");
    } catch (error) {
        console.log(error);
    }
}

function doSwap(userAddress, amount) {
    return Moralis.Plugins.oneInch.swap({
        chain: "eth", // The blockchain you want to use (eth/bsc/polygon)
        fromTokenAddress: currentTrade.from.address, // The token you want to swap
        toTokenAddress: currentTrade.to.address, // The token you want to receive
        amount: amount,
        fromAddress: userAddress, // Your wallet address
        slippage: 1,
    });
}