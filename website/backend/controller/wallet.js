
const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');

const testNetworkRoot = path.resolve(__dirname, '../../../network');

const generateAllWallet =async (req,res)=>{

    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        
        const predefinedOrgs = [
            {
                name: 'org1.example.com',
                mspId: 'Org1MSP',
                users: ['Admin', 'User1']
            }, {
                name: 'org2.example.com',
                mspId: 'Org2MSP',
                users: ['Admin', 'User1']
            }
        ];

        for (const org of predefinedOrgs) {
            const credPath = path.join(testNetworkRoot, '/organizations/peerOrganizations/', org.name, '/users');
            
            for (const user of org.users) {
                const mspFolderPath = path.join(credPath, `${user}@${org.name}`, '/msp');
                
                // expecting only one cert file and one key file to be in the directories
                const certFile = path.join(mspFolderPath, '/signcerts/', fs.readdirSync(path.join(mspFolderPath, '/signcerts'))[0]);
                const keyFile = path.join(mspFolderPath, '/keystore/', fs.readdirSync(path.join(mspFolderPath, '/keystore'))[0]);

                const cert = fs.readFileSync(certFile).toString();
                const key = fs.readFileSync(keyFile).toString();

                const identity = {
                    credentials: {
                        certificate: cert,
                        privateKey: key,
                    },
                    mspId: org.mspId,
                    type: 'X.509',
                };

                const identityLabel = `${user}@${org.name}`;
                await wallet.put(identityLabel, identity);
            }
        }
        return res.status(200).json({success:true,msg:"Successfully generated wallets"})

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
        return res.status(400).json({success:false, msg:'failed to generate wallets for Users'})

    }

}

module.exports={
    generateAllWallet
}