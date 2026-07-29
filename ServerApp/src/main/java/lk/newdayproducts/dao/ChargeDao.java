package lk.newdayproducts.dao;

import lk.newdayproducts.dto.COcount;
import lk.newdayproducts.entity.Charge;
import lk.newdayproducts.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChargeDao extends JpaRepository<Charge,Integer> {

    @Query("select co.client from Clientorder co group by co.client HAVING count(co.id)=1")
    List<Client> getClientwithmorethantwoorders();


    @Query("select new COcount(c.name,count(c.id)) from Client c , Clientorder co where c.id=co.client.id group by c.id having count(*)>2")
    List<COcount> getClientByOrders();
}

