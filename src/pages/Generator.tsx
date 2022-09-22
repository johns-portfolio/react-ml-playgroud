import React, { useEffect, useState } from 'react'

const Generator = () => {
  const [allData, setAllData] = useState(
    Array(12)
      .fill(undefined)
      .map((c, i) => `This is data ${i + 1}`)
  )
  const [currentData, setCurrentData] = useState<string[]>([])
  const [lazyData, setLazyData] = useState<Generator<
    string[],
    void,
    unknown
  > | null>(null)

  function* lazyLoadData(n: number) {
    let page = 0
    while (page * n < allData.length) {
      const result = allData.slice(0, (page + 1) * n)
      yield result
      page++
    }

    return
  }

  const fetchNewData = () => {
    const newData = lazyData!.next().value
    if (newData && newData.length > 0) {
      setCurrentData(newData)
    }
  }

  useEffect(() => {
    setLazyData(lazyLoadData(5))
  }, [allData])

  useEffect(() => {
    if (lazyData) {
      fetchNewData()
    }
  }, [lazyData])

  return (
    <div className="p-4">
      <div className="flex flex-col">
        {currentData.map((c, i) => (
          <span key={i} className="border-2 mb-2 p-2">
            {c}
          </span>
        ))}
        {currentData.length < allData.length && (
          <button
            type="button"
            className="bg-green-600 rounded-3xl p-2 text-white hover:bg-green-300"
            onClick={fetchNewData}
          >
            Load more...
          </button>
        )}
      </div>
    </div>
  )
}

export default Generator
