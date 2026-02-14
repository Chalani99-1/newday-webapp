package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ClientCountByState {

    @Id
    private Integer id;
    private String state;
    private Long count;
    private double percentage;

    public ClientCountByState() {
    }

    public ClientCountByState(String state, Long count) {
        this.state = state;
        this.count = count;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
    public double getPercentage() {
        return percentage;
    }
    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
