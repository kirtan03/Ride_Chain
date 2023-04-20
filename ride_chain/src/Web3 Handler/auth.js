import ipfs from './ipfs'
import contract from './contract'

export async function sign_up(account_no, user_details) {
   var rootUserHash = await contract.methods.getRootUserHash().call();
  
    try {
        let userDetailHash = await ipfs.add(JSON.stringify(user_details))

        let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${rootUserHash}`
        const userDataResponse = await fetch(url);
        const userDataJson = await userDataResponse.text();
        let userDataObj = JSON.parse(userDataJson)

        userDataObj[account_no] = userDetailHash.path;
        let newRootUsersHash = await ipfs.add(JSON.stringify(userDataObj))

        await contract.methods.setRootUserHash(newRootUsersHash.path).send({from: account_no})

        sign_in(account_no);
      } catch (error) {
        console.log('Error signing up: ', error)
      }
}

async function sign_in(account_no) {

    var rootUserHash = await contract.methods.getRootUserHash().call();
    
    try {
        let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${rootUserHash}`
        const userDataResponse = await fetch(url);
        const userDataJson = await userDataResponse.text();
        let userDataObj = JSON.parse(userDataJson)
        let usersAccounts = Object.keys(userDataObj)

        let userIpfsHash = null;

        //compare the acccount_no with the keys of the object, to get the userIpfsHash
        for(let i = 0;i<usersAccounts.length;i++)
        {
          if(usersAccounts[i] == account_no)
          {
            userIpfsHash = userDataObj[account_no];
            break;
          }
        }
        if(userIpfsHash == null) //if user not registered
          window.location.href = '/signup'
        else{
          window.localStorage.setItem("userIpfsHash", userIpfsHash);
          window.location.href = '/profile/'+userIpfsHash
        }
      } catch (error) {
        console.log('Error signing in: ', error)
      }
}

export default sign_in