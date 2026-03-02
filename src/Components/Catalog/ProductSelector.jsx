import Button from 'react-bootstrap/Button';

const ProductSelector = ({products=[], selectedProducts=[], setSelectedProducts, cut, setCut}) => {

  const checkIfSelected = (id) => {
    if(cut.items.length == 0) return false;
    return cut.items.some(oldId => oldId === id)
  }

  const handleSelectProduct = (e) => {
    let id = e.currentTarget.id;
    let check = checkIfSelected(id);
    if(check) {
      setCut({
        ...cut,
        items: cut.items.filter(item => item !== id)
      })
      // setSelectedProducts(selectedProducts.filter(oldId => oldId !== id))
      e.currentTarget.classList.remove('bg-success');
      e.currentTarget.classList.remove('text-white');
    } else {
      // let newSelectedProducts = [...selectedProducts, id] 
      // setSelectedProducts(newSelectedProducts)
      setCut({
        ...cut,
        items: [...cut.items, id]
      })
      e.currentTarget.classList.add('bg-success');
      e.currentTarget.classList.add('text-white');
    }
  }

  return (
    <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
      {
        products.length === 0 ?
        <div className="py-1 px-3 d-flex justify-content-center align-items-center rounded-2 bg-secondary text-white cursor-pointer fw-bold">
          لا يوجد منتجات
        </div> :
        products.map((product, index) =>(
          <Button
            id={`product-${product.id}`}
            key={index}
            className={`btn btn-secondary px-3 d-flex justify-content-center align-items-center fw-bold`}
            onClick={handleSelectProduct}
          >
            {product.productCode}
          </Button>
        ))
      }
    </div>
  )
}

export default ProductSelector