let secretKey
let publicKey
const getSecret = async () => {
      try {
        let res = await fetch("http://localhost:8080/api/v1/key/secret"),
          json = await res.json()

        if (!res.ok) throw { status: res.status, statusText: res.statusText }

        console.log(json)
        console.log(json.k)
        secretKey = json.k

      } catch (err) {
        let message = err.statusText || "Ocurrió un error"
        console.log(message)
      }
     console.log(secretKey)
     return secretKey
    }
const getPublic = async () => {
      try {
        let res = await fetch("http://localhost:8080/api/v1/key/public"),
          json = await res.json()

        if (!res.ok) throw { status: res.status, statusText: res.statusText }

        console.log(json)
           console.log(json.k)
        publicKey = json.k

      } catch (err) {
        let message = err.statusText || "Ocurrió un error"
        console.log(message)
      }
     console.log(publicKey)
     return publicKey
    }
    export default {
       getPublic,
      getSecret
    }