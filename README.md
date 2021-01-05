# Orders-API

List of all the orders

Client -> Server: GET /
Server -> Database: Query.find(orders)
Database -> Database: Check for errors
Database --> Server: If any error, error message
Server --> Client: Error(500)
Database -> Server: If no errors, returns all OrderRecords
Server -> Client: OrderRecords

Create a single Order

Client -> Server: POST /{orderId}
Server -> Server: Validation for the new order
Server --> Client: If any error: error message(400)
Server -> Server: new OrderObject
Server -> Database: Save new OrderObject
Server -> Client: OrderObject
Database --> Server: Error
Server --> Client: Error(500)

List a single order

Client -> Server: GET /{orderId}
Server -> Database: Query.findOne(orderId)
Database --> Database: Match the orderId with the order
Database --> Server: If no match, error message(400)
Server --> Client: An order with the specified ID was not found
Database -> Server: OrderRecord
Server -> Client: OrderRecord
Server --> Client: If any error: error(500)

Delete an order

Client -> Server: DELETE /{orderId}
Server -> Database: Query.findOneAndDelete(orderId)
Database --> Database:Match the orderId with the order
Database --> Server: If no match, error message(400)
Server --> Client: An order with the specified ID was not found
Database -> Database: Delete OrderRecord
Database -> Server: Updated database
Server --> Client: Successfully deleted the product
Server --> Client: If any error: error(500)

Update an order

Client -> Server: PUT /{orderId}
Server -> Database: Query.findOneAndUpdate(orderId)
Database --> Database:Match the orderId with the order
Database --> Server: If no match: error(400)
Server --> Client: An order with the specified ID was not found
Database -> Database: Update the OrderRecord
Database -> Server: Updated OrderRecord
Server -> Client: Successfully updated the product
Server --> Client: If any error: error(500)
