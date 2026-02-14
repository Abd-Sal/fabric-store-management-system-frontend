const ProductsViewer = ({products}) => {
  return (
    <div className="pt-3 rounded">
      <div className="border-1 border-gray rounded">
        <table className="table table-light table-hover table-border bg-gray table-striped">
          <thead className="">
            <tr className="text-center border-1 border-gray">
              <th scope="col" className="border-1 border-gray">#</th>
              <th scope="col" className="border-1 border-gray">المعرف</th>
              <th scope="col" className="border-1 border-gray">كود كامل</th>
              <th scope="col" className="border-1 border-gray">اسم المنتج</th>
              <th scope="col" className="border-1 border-gray">كود المنتج</th>
              <th scope="col" className="border-1 border-gray">لون المنتج</th>
              <th scope="col" className="border-1 border-gray">وحدة القياس</th>
              <th scope="col" className="border-1 border-gray">مادة المنتج</th>
              <th scope="col" className="border-1 border-gray">تاريخ الاضافة</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="text-center border-1 border-gray">
                <th scope="row">{index + 1}</th>
                <td className="border-1 border-gray">{product.id}</td>
                <td className="border-1 border-gray">{product.productCode}</td>
                <td className="border-1 border-gray">{product.name ?? '---'}</td>
                <td className="border-1 border-gray">{product.code}</td>
                <td className="border-1 border-gray">{product.color}</td>
                <td className="border-1 border-gray">{product.unit}</td>
                <td className="border-1 border-gray">{product.material ?? '---'}</td>
                <td className="border-1 border-gray">{new Date(product.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsViewer