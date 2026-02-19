const DataViewer = ({specialStyle = '', headData=[], bodyData=[]}) => {
  return (
    <div className={`${specialStyle} rounded border-1 border-gray`} style={{ overflowX: 'auto' }}>
        <table className={`table-sm table table-light table-hover table-border bg-gray table-striped`} style={{ minWidth: '100%', width: 'max-content' }}>
            <thead>
                <tr className="text-center border-1 border-gray">
                    <th scope="col" className="border-1 border-gray">#</th>
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
                            <td className="border-1 border-gray">{index + 1}</td>
                            {
                                headData.map((key, ind)=>(
                                    <td key={`${index}-${ind}`} className="border-1 border-gray">
                                        {
                                            bodyD[key.value] ?
                                                key.hasOwnProperty('dataType') ?
                                                    (()=>{
                                                        const dataType = key['dataType'];
                                                        switch (dataType) {
                                                            case 'date':
                                                                return `${new Date(bodyD[key.value] + 'Z').toLocaleString()}`
                                                            case 'bool':
                                                                return <span className={`d-flex justify-content-center align-items-center p-3 rounded-5 ${bodyD[key.value] == true ? 'bg-success' : 'bg-danger'}`}></span>
                                                            default:
                                                                return bodyD[key.value]
                                                        }
                                                    })()
                                                    :
                                                    bodyD[key.value]
                                            :
                                                key['dataType'] == 'bool' ?
                                                    <span className={`d-flex justify-content-center align-items-center p-3 rounded-5 bg-danger`}></span>
                                                : "---"
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