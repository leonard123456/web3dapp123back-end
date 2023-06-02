const { ethers, upgrades } = require("hardhat");


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}



const contracts = {
    pancakeRouter: '0x9777560456f238866E7580C4E9Bfc33585fE9de6',
    pancakeFactory: '0xAD9214FEa02cadC8715712BdeBce0b92B676eBa8',
    multiSignature: '0x64Dc9dcaEe8621bF6099275a8df4d7cAdBaEeF29',
    multiSignatureToSToken: '0x64Dc9dcaEe8621bF6099275a8df4d7cAdBaEeF29',
    usdc: '0xe34b46094Aa106d2eD84F400657610af18b0c055',
    fish: '0xFef0A952A373BAAD1c95Ccde511F0088be0ba1C7',
    fishOracle: '0xBE084c9EB765A172f095E75d560C469F6382c5E1',
    sFISH: '0xCB93EBa38fa61390e2BfF2D0C843117E9B647761',
    dev: '0x64Dc9dcaEe8621bF6099275a8df4d7cAdBaEeF29',
    op: '0x64Dc9dcaEe8621bF6099275a8df4d7cAdBaEeF29',
    usdc_fish_lp: '0x36e3c449De8eb9D9ba78E21AED72ad593A53A644',
    fishNft: '0xfa7E978640B49c186B413d635F07B9Ac0C704819',
    usdcBuyNftLogic: '0x64D17AcF37826a5aF02183d37A8F44CaEFFbB242'
}


async function main() {
    const [deployer] = await ethers.getSigners();

    var now = Math.round(new Date() / 1000);
    contracts.dev = deployer.address;
    contracts.op = deployer.address;
    console.log('部署人：', deployer.address);

    const PancakeRouter = await ethers.getContractFactory('PancakeRouter');
    const pancakeRouter = PancakeRouter.attach(contracts.pancakeRouter);
    console.log("PancakeRouter:", contracts.pancakeRouter);
    const PancakeFactory = await ethers.getContractFactory('PancakeFactory');
    const pancakeFactory = PancakeFactory.attach(contracts.pancakeFactory);
    console.log("PancakeFactory:", contracts.pancakeFactory);

    /**
     * 假USDC ERC20 (实盘不需要)
     */
    const USDCERC20 = await ethers.getContractFactory('FishERC20');
    if (contracts.usdc) {
        var usdc = USDCERC20.attach(contracts.usdc);
    } else {
        usdc = await upgrades.deployProxy(USDCERC20, ['USDC-test', 'USDC-test', deployer.address, '100000000000000000000000000'], { initializer: 'initialize' });
        await usdc.deployed();
    }
    contracts.usdc = usdc.address;
    console.log("usdc:", contracts.usdc);


    /**
     * FishERC20
     */
    const FishERC20 = await ethers.getContractFactory('FishERC20');
    if (contracts.fish) {
        var fish = FishERC20.attach(contracts.fish);
    } else {
        fish = await upgrades.deployProxy(FishERC20, ['Fish Token', 'FISH', deployer.address, '100000000000000000'], { initializer: 'initialize' });
        await fish.deployed();
    }
    contracts.fish = fish.address;
    console.log("fish:", contracts.fish);

    /**
     * 组流动性 
     */
    await pancakeFactory.createPair(fish.address, usdc.address);
    await sleep(10000);
    var usdc_fish_lp_address = await pancakeFactory.getPair(fish.address, usdc.address);
    console.log("usdc_fish_lp_address:", usdc_fish_lp_address);
    contracts.usdc_fish_lp = usdc_fish_lp_address;
    await usdc.approve(contracts.pancakeRouter, '1000000000000000000000000000000'); console.log("usdc.approve:");
    await fish.approve(contracts.pancakeRouter, '1000000000000000000000000000000'); console.log("fish.approve:");
    await pancakeRouter.addLiquidity(
        fish.address,
        usdc.address,
        '100000000000000000',//0.1 fish
        '1500000000000000000',//1.5u
        0,
        0,
        deployer.address,
        Math.round(new Date() / 1000) + 1000
    );
    console.log("addLiquidity");

    /**
     * FISHOracle
     */
    const FISHOracle = await ethers.getContractFactory('FISHOracle');
    if (contracts.fishOracle) {
        var fishOracle = FISHOracle.attach(contracts.fishOracle);
    } else {
        fishOracle = await upgrades.deployProxy(FISHOracle, [usdc_fish_lp_address, contracts.fish], { initializer: 'initialize' });
        await fishOracle.deployed();
    }
    await fishOracle.get('0x0000000000000000000000000000000000000000'); console.log("get:");
    contracts.fishOracle = fishOracle.address;
    console.log("fishOracle:", contracts.fishOracle);
    /**
     * sFISH
     */
    const SFISH = await ethers.getContractFactory('sFISH');
    if (contracts.sFISH) {
        var sFISH = SFISH.attach(contracts.sFISH);
    } else {
        sFISH = await SFISH.deploy(fish.address);
        //定价
        await fish.approve(sFISH.address, '1000000000000000000000000000000'); console.log("fish.approve:sFISH");
        await fish.setExecutor(deployer.address, true); console.log("fish.setExecutor deployer.address");
        await fish.mint(deployer.address, '1000000000000000000');
        await sFISH.mint('1000000000000000000'); console.log("sFISH.mint");
    }
    contracts.sFISH = sFISH.address;
    console.log("sFISH:", contracts.sFISH);





    /**
     * fishNFT FishNft
     */
    const FishNft = await ethers.getContractFactory('FishNft');
    if (contracts.fishNft) {
        var fishNft = FishNft.attach(contracts.fishNft);
    } else {
        fishNft = await upgrades.deployProxy(FishNft, ["0xFishBone Nft", 'FB-NFT', contracts.fish], { initializer: 'initialize' });
        await fishNft.deployed();
    }
    contracts.fishNft = fishNft.address;
    console.log("fishNft:", contracts.fishNft);

    /**
    * UsdcBuyNftLogic
    */
    const UsdcBuyNftLogic = await ethers.getContractFactory('usdcBuyNftLogic');
    if (contracts.usdcBuyNftLogic) {
        var usdcBuyNftLogic = UsdcBuyNftLogic.attach(contracts.usdcBuyNftLogic);
    } else {
        usdcBuyNftLogic = await upgrades.deployProxy(UsdcBuyNftLogic, [
            contracts.fish,
            contracts.fishNft,
            contracts.pancakeFactory,
            contracts.pancakeRouter,
            contracts.multiSignature,
            contracts.multiSignatureToSToken,
            contracts.dev,
            contracts.op,
            contracts.sFISH,
            contracts.fishOracle,
            contracts.usdc], { initializer: 'initialize' });
        await usdcBuyNftLogic.deployed();
    }

    contracts.usdcBuyNftLogic = usdcBuyNftLogic.address;
    console.log("usdcBuyNftLogic:", contracts.usdcBuyNftLogic);

    //设置执行者
    await fish.setExecutor(contracts.fishNft, true); console.log("fish.setExecutor");
    await fish.setExecutor(contracts.usdcBuyNftLogic, true); console.log("fish.setExecutor");
    await fishNft.setExecutor(contracts.usdcBuyNftLogic, true); console.log("fishNft.setExecutor");


    //approve usdcBuyNftLogic 测试买入用
    await usdc.approve(contracts.usdcBuyNftLogic, '1000000000000000000000000000000'); console.log("usdc.approve:usdcBuyNftLogic");


    console.log("////////////////////全部合约//////////////////////");
    console.log("contracts:", contracts);
    console.log("/////////////////////END/////////////////////");




}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })




