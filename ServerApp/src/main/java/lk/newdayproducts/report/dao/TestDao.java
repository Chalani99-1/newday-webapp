package lk.newdayproducts.report.dao;

import lk.newdayproducts.entity.Employee;
import lk.newdayproducts.report.entity.ClientCountByState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TestDao extends JpaRepository<Employee, Integer> {


//    @Query("SELECT new ClientCountByState(s.name, COUNT(c.id)) " +
//           "FROM Client c, State s " +
//           "WHERE c.state.id = s.id " +
//           "GROUP BY s.name")
//    List<ClientCountByState> clientCountByState();

}

