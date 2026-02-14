package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Grn;
import lk.newdayproducts.entity.Productionorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GrnDao extends JpaRepository<Grn,Integer> {
    @Query("select g from Grn g where g.id = :id")
    Grn findByMyId(@Param("id") Integer id);
}

