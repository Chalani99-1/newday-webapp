package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClientDao extends JpaRepository<Client,Integer> {

    @Query("select c from Client c where c.id = :id")
    Client findByMyId(@Param("id") Integer id);

    @Query("select c from Client c where c.name=:name")
    Client findByName(@Param("name")String name);
}

