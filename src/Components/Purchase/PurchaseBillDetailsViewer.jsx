const PurchaseBillDetailsViewer = ({specialStyle = '', billDetails = [], setBillDetails}) => {

    return (
        <div className={`${specialStyle} rounded border-1 border-gray`} style={{ overflowX: 'auto', overflowY: 'auto' }}>
            <table className={`table-sm table table-light table-hover table-border bg-gray table-striped`} style={{ minWidth: '100%', width: 'max-content'}}>
                <thead>
                    <tr className="text-center border-1 border-gray">
                        <th scope="col" className='border-1 border-gray'>#</th>
                        <th scope="col" className='border-1 border-gray'>معرف المنتج</th>
                        <th scope="col" className='border-1 border-gray'>كود المنتج</th>
                        <th scope="col" className='border-1 border-gray'>سعر الوحدة</th>
                        <th scope="col" className='border-1 border-gray'>الكمية</th>
                        <th scope="col" className='border-1 border-gray'>المجموع</th>
                        <th scope="col" className='border-1 border-gray'>مسح</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        billDetails.length > 0 &&
                        billDetails.map((detail, index) => (
                            <tr key={Math.random()} className='text-center border-1 border-gray'>
                                <td key={`${detail.id}-${index}-${Math.random()}`} className="border-1 border-gray">
                                    {index+1}
                                </td>
                                <td key={`${detail.id}-${index}-${Math.random()}`} className="border-1 border-gray">
                                    {detail.id}
                                </td>
                                <td key={`${detail.id}-${index}-${Math.random()}`} className="border-1 border-gray">
                                    {detail.productCode}
                                </td>
                                <td key={`${detail.id}-${index}-${Math.random()}`} className="border-1 border-gray">
                                    {detail.unitPrice}
                                </td>
                                <td key={`${detail.id}-${index}-${Math.random()}`} className="border-1 border-gray">
                                    {detail.quantity}
                                </td>
                                <td key={`${detail.id}-${index}-${Math.random()}`} className="border-1 border-gray">
                                    {detail.total}
                                </td>
                                <td key={`${detail.id}-${index}-${Math.random()}`} className="border-1 border-gray">
                                    {detail.remove}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default PurchaseBillDetailsViewer