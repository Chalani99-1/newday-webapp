package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.CountByMaterialCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClientCountByStateDao extends JpaRepository<ClientCountByState, Integer> {
        @Query
        ("SELECT new ClientCountByState(s.name, COUNT(s.name)) FROM State s, Client c WHERE s.id = c.state.id GROUP BY s.name")
        List<ClientCountByState> countClientCountByState();
        
}
