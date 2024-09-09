export default function makeRedisCache({
	makeSetCache,
	makeGetCache
}) {
	return Object.freeze({
		setCache,
		getCache
	})
	
	function setCache({ data, cacheKey }){
  	makeSetCache({ data, cacheKey });
		return;
	}

	async function getKeys({ cacheKey }) {
		// return makeGetCache({ cacheKey, cacheConfig});
	}

	function getCache({ cacheKey }) {
		return makeGetCache({ cacheKey })
	}
}