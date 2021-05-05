# Homework 4

Second entity and Many-to-Many entity relationships

- GroupsModule
- ManyToMany relation between Group and User enitites
- Transactions
- CoreModule, hashService using argon2 according to [OWASP recommendation](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Gradual midration](https://github.com/ranisalt/node-argon2/wiki/Migrating-from-another-hash-function) of the existing plain text passwords
- Migrating permissions from text to enum, including data migration
- IsArray of enums validation
- Business logic errors thrown from Service, HTTP errors thrown from Controller



**GET /groups**
![groups_get](https://user-images.githubusercontent.com/16776066/117212152-a537d780-ae02-11eb-8c9b-b0caf3df4d38.png)

**GET /groups/:id**
![groups_get_by_id](https://user-images.githubusercontent.com/16776066/117212200-b84aa780-ae02-11eb-9f6a-196e615a516b.png)

**GET /groups/:id - fail**
![groups_get_by_id_fail](https://user-images.githubusercontent.com/16776066/117212220-bed91f00-ae02-11eb-928b-948deabdece6.png)

**POST /groups**
![groups_post](https://user-images.githubusercontent.com/16776066/117212301-d7e1d000-ae02-11eb-8358-fa10ca39d270.png)

**POST /groups - fail: enum validation**
![groups_post_fail](https://user-images.githubusercontent.com/16776066/117212309-dadcc080-ae02-11eb-9f05-e065554bd993.png)

**POST /groups - fail: conflict**
![groups_post_fail_conflict](https://user-images.githubusercontent.com/16776066/117214481-9141a500-ae05-11eb-965f-35cf89a43681.png)

**DELETE /groups**
![groups_delete](https://user-images.githubusercontent.com/16776066/117212322-ddd7b100-ae02-11eb-9005-c0af9327cb4d.png)

**POST /groups/:id/add-users**
![groups_add_users](https://user-images.githubusercontent.com/16776066/117212334-e29c6500-ae02-11eb-88a0-7771f6b92890.png)

**POST /groups/:id/add-users - fail validation**
![groups_add_users_fail_validation](https://user-images.githubusercontent.com/16776066/117212352-e7611900-ae02-11eb-8bba-f4b90a218ae2.png)

**POST /groups/:id/add-users - wrong user IDs**
![groups_add_users_fail_wrong_user_ids](https://user-images.githubusercontent.com/16776066/117212363-eaf4a000-ae02-11eb-8d41-cfd22bee811c.png)
