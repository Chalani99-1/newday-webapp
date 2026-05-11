package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.ProductCountByCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductCountByCategoryDao extends JpaRepository<ProductCountByCategory, Integer> {
        @Query
        ("SELECT new ProductCountByCategory (pc.name, COUNT(pc.name)) FROM Productcategory pc, Product p WHERE pc.id = p.productcategory.id GROUP BY pc.name")
        List<ProductCountByCategory> countProductCountByCategory();
        
}
