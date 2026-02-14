package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class ClientOrderCompletion {

    @Id
    private Integer id;
    private String number;
    private String clientName;
    private Integer datediff;

    public ClientOrderCompletion() {
    }

    public ClientOrderCompletion(String number, String clientName, Integer datediff) {
        this.number = number;
        this.clientName = clientName;
        this.datediff = datediff;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Integer getDatediff() {
        return datediff;
    }

    public void setDatediff(Integer datediff) {
        this.datediff = datediff;
    }
}
