const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const testNetworkRoot = path.resolve(__dirname, '../../../network');

const invokeFunction = async (req,res)=>{

    const gateway = new Gateway();
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    const {username,chaincodeName,functionName,chaincodeArgs,orgName,orgNameWithDomain,channelName}= req.body
    try{
        console.log(gateway)
        let connectionProfile = JSON.parse(fs.readFileSync(
            path.join(testNetworkRoot, 
                'organizations/peerOrganizations', 
                orgNameWithDomain, 
                `/connection-${orgName}.json`), 'utf8')
        );
        const identityLabel = `${username}@${orgNameWithDomain}`;
        let connectionOptions = {
            identity: identityLabel,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true}
        };
        console.log('Connect to a Hyperledger Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        console.log(`Use channel "${channelName}".`);
        const network = await gateway.getNetwork(channelName);

        console.log(`Use ${chaincodeName}.`);
        const contract = network.getContract(chaincodeName);

        console.log('Submit ' + functionName + ' transaction.');
        const response = await contract.submitTransaction(functionName, ...chaincodeArgs);
        if (`${response}` !== '') {
            console.log(`Response from ${functionName}: ${response}`);
        }
        console.log('Disconnect from the gateway.');
        gateway.disconnect();
        return res.status(200).json({sucess:true,msg:"Successfully submitted the transaction",data:response.toString('utf8')})

    }
    catch(error){
        console.log('Disconnect from the gateway.');
        gateway.disconnect();
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        return res.status(400).json({sucess:false,msg:"Transaction failed"})

    }


}

const queryFunction = async (req,res)=>{
    const gateway = new Gateway();
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    try{

        res.status(200).json({sucess:true,msg:"Successfully submitted the transaction"})

    }
    catch{
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        res.status(400).json({sucess:false,msg:"Transaction failed"})

    }
    // finally code is executed 
    finally{
        console.log('Disconnect from the gateway.');
        gateway.disconnect();
    }

}

module.exports ={
    invokeFunction,
    queryFunction
}