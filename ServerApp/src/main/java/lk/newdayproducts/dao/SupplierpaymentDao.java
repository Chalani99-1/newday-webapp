package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Productionorder;
import lk.newdayproducts.entity.Supplierpayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierpaymentDao extends JpaRepository<Supplierpayment,Integer> {
    @Query("select s from Supplierpayment s where s.id = :id")
    Supplierpayment findByMyId(@Param("id") Integer id);
}

