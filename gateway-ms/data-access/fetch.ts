export default function createFetch(){
    return Object.freeze({
        makeFetch
    }) 
    
    async function makeFetch({ params, headers = {}, method, path }) {
        
        const results = await fetch(path, { 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers
              },
            method, 
            body: JSON.stringify(params) 
        })
        
        return results
    }
}