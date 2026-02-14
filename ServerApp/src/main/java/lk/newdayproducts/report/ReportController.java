package lk.newdayproducts.report;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {


    @GetMapping(path = "/test", produces = "application/json")
    public String getTest() {
               return "success";
    }

}



