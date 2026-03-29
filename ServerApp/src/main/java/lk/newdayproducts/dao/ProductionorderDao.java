package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Product;
import lk.newdayproducts.entity.Productionorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductionorderDao extends JpaRepository<Productionorder,Integer> {
    @Query("select po from Productionorder po where po.id = :id")
    Productionorder findByMyId(@Param("id") Integer id);

    @Query("SELECT max(p.id) FROM Productionorder  p")
    int findMaxNumber();

    @Query("select i from Productionorder i where i.ordernumber=:ordernumber")
    Product findbyNumber(@Param("ordernumber") String ordernumber);
}

