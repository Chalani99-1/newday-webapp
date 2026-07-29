package lk.newdayproducts.dto;

import org.springframework.context.annotation.Bean;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class SupAndMatCatCount {
    @Id
    private Long id;
    private String name;
    private  Long count;

    public SupAndMatCatCount() {
          }
    public SupAndMatCatCount(String name, Long count) {
        this.name = name;
        this.count = count;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
