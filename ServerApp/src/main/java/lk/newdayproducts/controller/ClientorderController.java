package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.dto.NotifyResponse;
import lk.newdayproducts.entity.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/clientorders")
public class ClientorderController {

    @Autowired
    private ClientorderDao clientorderdao;

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Map<String, String>> get() {
        int maxid = this.clientorderdao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        Map<String, String> response = new HashMap<>();
        response.put("number", "" + maxid);
        return ResponseEntity.ok().body(response);
    }

//    @GetMapping(path = "/number", produces = "application/json")
//    public ResponseEntity<Integer> get() {
//        int maxid = this.clientorderdao.findMaxNumber();
//        if (maxid == 0) maxid = 1;
//        return ResponseEntity.ok().body(maxid);
//    }

    @GetMapping(produces = "application/json")
    public List<Clientorder> get(@RequestParam HashMap<String, String> params) {
        String clientid = params.get("clientid");
        String employeeid = params.get("employeeid");
        String doexpected = params.get("doexpected");

        List<Clientorder> corders = this.clientorderdao.findAll();

        if (params.isEmpty()) return corders;
        Stream<Clientorder> postream = corders.stream();
        if (clientid != null) postream = postream.filter(o -> o.getClient().getId() == Integer.parseInt(clientid));
        if (employeeid != null)
            postream = postream.filter(o -> o.getEmployee().getId() == Integer.parseInt(employeeid));
        if (doexpected != null) postream = postream.filter(o -> o.getDoexpected().toString().contains(doexpected));

        return postream.collect(Collectors.toList());

    }

//    @GetMapping(path = "/lessthanweek", produces = "application/json")
//    public List<NotifyResponse> getLessThanWeek(@RequestParam HashMap<String, String> params) {
//        Date today = new Date();
////not less than week. edited to get all incomplete
//        // Create an instance of Calendar
//        Calendar calendar = Calendar.getInst ance();
//        calendar.setTime(today);  // Set the current date
//
//        // Add 7 days to the current date
//        calendar.add(Calendar.DAY_OF_MONTH, 7);
//
//        // Get the new date (7 days later)
//        Date endDate = calendar.getTime();
////        List<String> outOfStock = this.codao.findLessThanWeek(endDate);
//        List<String> outOfStock = this.clientorderdao.findIncomplete();
//        List<NotifyResponse> corders = new ArrayList<>();
//        for (String s : outOfStock) {
//            corders.add(new NotifyResponse(s));
//        }
//        if (params.isEmpty()) return corders;
//        Stream<NotifyResponse> postream = corders.stream();
//        return postream.collect(Collectors.toList());
//
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Clientorder clientorder) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        for (Orderproduct po : clientorder.getOrderproducts()) po.setClientorder(clientorder);

        if (clientorderdao.findbyNumber(clientorder.getNumber()) != null)
            errors = errors + "<br> Existing Order";

        if (errors == "") {
            clientorderdao.save(clientorder);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(clientorder.getId()));
        response.put("url", "/clientorder/" + clientorder.getId());
        response.put("errors", errors);

        return response;

    }
//    @PutMapping
//    @ResponseStatus(HttpStatus.CREATED)
//
//    public HashMap<String, String> update(@RequestBody Clientorder clientorder) {
//
//        HashMap<String, String> responce = new HashMap<>();
//        String errors = "";
//        Clientorder c = clientorderdao.findByMyId(clientorder.getId());
//
//        if (c != null && !(clientorder.getId().equals(c.getId())))
//            errors = errors + "<br> Not existing";
//
//        if (c != null) {
//            clientorderdao.save(clientorder);
//        } else {
//            errors = "Server Validation Errors : <br> " + errors;
//        }
//
//        responce.put("id", String.valueOf(clientorder.getId()));
//        responce.put("url", "/clientorders/" + clientorder.getId());
//        responce.put("errors", errors);
//
//        return responce;
//    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Clientorder order) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        Clientorder extOrder = clientorderdao.findByMyId(order.getId());

        if (extOrder != null && !(order.getNumber().equals(extOrder.getNumber()))) {
            errors = errors + "<br> Not existing";
        }

        if (extOrder != null) {
            try {
                extOrder.getOrderproducts().clear();

                order.getOrderproducts().forEach(newOP -> {
                    newOP.setClientorder(extOrder);
                    extOrder.getOrderproducts().add(newOP);

                });

                BeanUtils.copyProperties(order, extOrder, "id", "orderproducts", "amount");

                if (errors == "") {
                    System.out.println("update");
                    clientorderdao.save(extOrder);
                } else {
                    errors = "Server Validation Errors : <br> " + errors;
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.put("id", String.valueOf(order.getId()));
        response.put("url", "/clientorder/" + order.getId());
        response.put("errors", errors);

        return response;
    }


//    @PutMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String, String> update(@RequestBody Clientorder clientorder) {
//
//        HashMap<String, String> response = new HashMap<>();
//        String errors = "";
//        Clientorder extOrder = clientorderdao.findByMyId(clientorder.getId());
//
//        if (extOrder != null && !(clientorder.getNumber().equals(extOrder.getNumber()))) {
//            errors = errors + "<br> Not existing";
//        }
//
//        if (extOrder != null) {
//            try {
//                extOrder.getOrderproducts().clear();
//
//                clientorder.getOrderproducts().forEach(newOP -> {
//                    newOP.setClientorder(extOrder);
//                    extOrder.getOrderproducts().add(newOP);
//
//                });
//
//                BeanUtils.copyProperties(clientorder, extOrder, "id", "orderproducts", "amount");
//
//                if (errors == "") {
//                    System.out.println("update");
//                    clientorderdao.save(extOrder);
//                } else {
//                    errors = "Server Validation Errors : <br> " + errors;
//                }
//
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//
//        response.put("id", String.valueOf(clientorder.getId()));
//        response.put("url", "/clientorder/" + clientorder.getId());
//        response.put("errors", errors);
//
//        return response;
//    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Clientorder c = clientorderdao.findByMyId(id);

        if (c == null) errors = errors + "<br> Client Does Not Exist";

        if (errors.isEmpty()) clientorderdao.delete(c);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/clientorders/" + id);
        responce.put("errors", errors);

        return responce;
    }

}