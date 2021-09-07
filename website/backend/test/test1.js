const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')

chai.use(chaiHttp);
chai.should();

describe("First Test ",()=>{

    it("Get / success",()=>{
        chai.request(app)
            .get('/')
            .end((err,response)=>{
                response.should.have.status(200);
         
            })
    })
    it("Get / failed",()=>{
        chai.request(app)
            .get('/wrongUrl')
            .end((err,response)=>{
                response.should.have.status(404);
            
            })
    })

})
