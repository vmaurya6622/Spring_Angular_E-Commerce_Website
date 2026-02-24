package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.Product;
import org.example.ecommercewebsite.repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * this Service mainly provides:
 * <ul>
 *     <li>
 *         Paginated retrieval of products list.
 *     </li>
 *     <li>
 *         Fetching product details using its ID.
 *     </li>
 * </ul>
 * <p>
 *     Pagination and sorting are applied at the repository level to ensure
 *     efficient database queries.
 * </p>
 */

@Service
public class ProductService {
	@Autowired
	private ProductRepo productRepo;

	/**
	 * It retrieves a paginated list of products.
	 * <p>
	 *     It ensures that:
	 *     <ul>
	 *         <li>page number is not negative.</li>
	 *         <li>page size is >=1 </li>
	 *         <li>Results are sorted by productId in ascending order.</li>
	 *     </ul>
	 * </p>
	 * @param page this is zero based page index >= 0
	 * @param size number of records per page >= 1
	 * @return page containing product entities.
	 */

	public Page<Product> getProducts(int page, int size) {
		int pageNumber = Math.max(page, 0);
		int pageSize = Math.max(size, 1);
		return productRepo.findAll(PageRequest.of(pageNumber, pageSize, Sort.by("id").ascending()));
	}

	/**
	 * it retrieves product by its unique ID.
	 *
	 * @param id ID of the product.
	 * @return product entity.
	 * @throws ResponseStatusException if the product is not found.
	 */

	public Product getProductById(Long id) {
		return productRepo.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
	}
}
