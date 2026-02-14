package lk.newdayproducts.entity;



import lk.newdayproducts.util.RegexPattern;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Collection;

@Entity
public class Grn {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")
    private String number;
    @Basic
    @Column(name = "doreceived")
    private Timestamp doreceived;
    @Basic
    @Column(name = "grandtotal")

    private BigDecimal grandtotal;
    @ManyToOne
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id", nullable = false)
    private Purchaseorder purchaseorder;
    @ManyToOne
    @JoinColumn(name = "grnstatus_id", referencedColumnName = "id", nullable = false)
    private Grnstatus grnstatus;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    @OneToMany(mappedBy = "grn",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Grnrawmaterial> grnrawmaterials ;


    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Timestamp getDoreceived() {
        return doreceived;
    }

    public void setDoreceived(Timestamp doreceived) {
        this.doreceived = doreceived;
    }

    public BigDecimal getGrandtotal() {
        return grandtotal;
    }

    public void setGrandtotal(BigDecimal grandtotal) {
        this.grandtotal = grandtotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Grn grn = (Grn) o;

        if (id != null ? !id.equals(grn.id) : grn.id != null) return false;
        if (doreceived != null ? !doreceived.equals(grn.doreceived) : grn.doreceived != null) return false;
        if (grandtotal != null ? !grandtotal.equals(grn.grandtotal) : grn.grandtotal != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (doreceived != null ? doreceived.hashCode() : 0);
        result = 31 * result + (grandtotal != null ? grandtotal.hashCode() : 0);
        return result;
    }

    public Purchaseorder getPurchaseorder() {
        return purchaseorder;
    }

    public void setPurchaseorder(Purchaseorder purchaseorder) {
        this.purchaseorder = purchaseorder;
    }

    public Grnstatus getGrnstatus() {
        return grnstatus;
    }

    public void setGrnstatus(Grnstatus grnstatus) {
        this.grnstatus = grnstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Grnrawmaterial> getGrnrawmaterials() {
        return grnrawmaterials;
    }

    public void setGrnrawmaterials(Collection<Grnrawmaterial> grnrawmaterials) {
        this.grnrawmaterials = grnrawmaterials;
    }

}
