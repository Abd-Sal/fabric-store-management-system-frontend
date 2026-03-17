const DataViewer = ({specialStyle = '', headData=[], bodyData=[], goToDetails, enableGoToDetails = true}) => {        
    
    return (
        <div className={`${specialStyle} rounded border-1 border-gray`} style={{ overflowX: 'auto' }}>
            <table className={`table-sm table table-dark table-hover table-border border-secondary bg-gray table-striped`} style={{ minWidth: '100%', width: 'max-content' }}>
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
                            <tr
                                id={`row-${index}`}
                                key={index}
                                className={`text-center border-1 border-gray ${enableGoToDetails ? 'cursor-pointer' : ''}`}
                                onClick={enableGoToDetails ? goToDetails : undefined}
                            >
                                <td className="border-1 border-gray">{index + 1}</td>
                                {
                                    headData.map((key, ind)=>(
                                        <td key={`${index}-${ind}`} className="p-2 border-1 border-gray">
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