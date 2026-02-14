package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.newdayproducts.util.RegexPattern;


import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
public class Productionorder {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "ordernumber")
    private String ordernumber;
    @Basic
    @Column(name = "dorequired")
    private Date dorequired;
    @Basic
    @Column(name = "completepercentage")
    private String completepercentage;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "doplaced")
    private Date doplaced;
    @ManyToOne
    @JoinColumn(name = "productionorderstatus_id", referencedColumnName = "id", nullable = false)
    private Productionorderstatus productionorderstatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @OneToMany(mappedBy = "productionorder",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Productionorderproduct> productionorderproducts;

    @ManyToOne
    @JoinColumn(name = "clientorder_id", referencedColumnName = "id", nullable = false)
    private Clientorder clientorder;

    public Clientorder getClientorder() {
        return clientorder;
    }

    public void setClientorder(Clientorder clientorder) {
        this.clientorder = clientorder;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOrdernumber() {
        return ordernumber;
    }

    public void setOrdernumber(String ordernumber) {
        this.ordernumber = ordernumber;
    }

    public Date getDorequired() {
        return dorequired;
    }

    public void setDorequired(Date dorequired) {
        this.dorequired = dorequired;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDoplaced() {
        return doplaced;
    }

    public void setDoplaced(Date daoplaced) {
        this.doplaced = daoplaced;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Productionorder that = (Productionorder) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (ordernumber != null ? !ordernumber.equals(that.ordernumber) : that.ordernumber != null) return false;
        if (dorequired != null ? !dorequired.equals(that.dorequired) : that.dorequired != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (doplaced != null ? !doplaced.equals(that.doplaced) : that.doplaced != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (ordernumber != null ? ordernumber.hashCode() : 0);
        result = 31 * result + (dorequired != null ? dorequired.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (doplaced != null ? doplaced.hashCode() : 0);
        return result;
    }

    public Productionorderstatus getProductionorderstatus() {
        return productionorderstatus;
    }

    public void setProductionorderstatus(Productionorderstatus productionorderstatus) {
        this.productionorderstatus = productionorderstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Productionorderproduct> getProductionorderproducts() {
        return productionorderproducts;
    }

    public void setProductionorderproducts(Collection<Productionorderproduct> productionorderproducts) {
        this.productionorderproducts = productionorderproducts;
    }

    public String getCompletepercentage() {
        return completepercentage;
    }

    public void setCompletepercentage(String completepercentage) {
        this.completepercentage = completepercentage;
    }


}
