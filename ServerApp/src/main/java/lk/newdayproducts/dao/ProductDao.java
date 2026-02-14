package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductDao extends JpaRepository<Product,Integer> {
    @Query("select p from Product p where p.id = :id")
    Product findByMyId(@Param("id") Integer id);

    @Query("select i from Product i where i.code=:code")
    Product findByCode(@Param("code")String code);
    @Query("SELECT max(p.id) FROM Product  p")
    int findMaxNumber();
}

