const DataViewer = ({specialStyle = '', headData=[], bodyData=[]}) => {
  return (
    <div className={`${specialStyle} rounded border-1 border-gray`}>
        <table className={`table-sm table table-light table-hover table-border bg-gray table-striped`}>
            <thead>
                <tr className="text-center border-1 border-gray">
                    {
                        headData.map((head, index)=>(
                          <th scope="col" key={index} className="border-1 border-gray">{head.label}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    bodyData.map((bodyD, index)=>(
                        <tr key={index} className="text-center border-1 border-gray">
                            {
                                headData.map((key, ind)=>(
                                    <td key={`${index}-${ind}`} className="border-1 border-gray">
                                        {
                                            bodyD[key.value]?
                                                key.hasOwnProperty('dateType') ?
                                                    new Date(bodyD[key.value]).toLocaleString()
                                                    :
                                                    bodyD[key.value]
                                            :
                                                "---"
                                        }
                                    </td> 
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
  )
}

export default DataViewer