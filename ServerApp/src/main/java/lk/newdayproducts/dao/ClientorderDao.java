package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Clientorder;
import lk.newdayproducts.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClientorderDao extends JpaRepository<Clientorder,Integer> {

    @Query("select co from Clientorder co where co.id = :id")
    Clientorder findByMyId(@Param("id") Integer id);
}

