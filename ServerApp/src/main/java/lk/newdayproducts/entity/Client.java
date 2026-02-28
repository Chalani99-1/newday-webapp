package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;


import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
public class Client {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "telephone")
    private String telephone;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "doregister")
    private Date doregister;
    @ManyToOne
    @JoinColumn(name = "state_id", referencedColumnName = "id", nullable = false)
    private State state;
    @ManyToOne
    @JoinColumn(name = "clientstatus_id", referencedColumnName = "id", nullable = false)
    private Clientstatus clientstatus;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @JsonIgnore
    @OneToMany(mappedBy = "client")
    private Collection<Clientorder> clientorders;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public Date getDoregister() {
        return doregister;
    }

    public void setDoregister(Date doregister) {
        this.doregister = doregister;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Client client = (Client) o;

        if (id != null ? !id.equals(client.id) : client.id != null) return false;
        if (name != null ? !name.equals(client.name) : client.name != null) return false;
        if (address != null ? !address.equals(client.address) : client.address != null) return false;
        if (telephone != null ? !telephone.equals(client.telephone) : client.telephone != null) return false;
        if (email != null ? !email.equals(client.email) : client.email != null) return false;
        if (doregister != null ? !doregister.equals(client.doregister) : client.doregister != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (telephone != null ? telephone.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (doregister != null ? doregister.hashCode() : 0);
        return result;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Clientstatus getClientstatus() {
        return clientstatus;
    }

    public void setClientstatus(Clientstatus clientstatus) {
        this.clientstatus = clientstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Clientorder> getClientorders() {
        return clientorders;
    }

    public void setClientorders(Collection<Clientorder> clientorders) {
        this.clientorders = clientorders;
    }
}
