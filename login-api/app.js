var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');
const secret = 'fullstack-login-lanchan';


app.use(cors());
app.use(express.json());

const mysql = require('mysql2');

// สร้างการเชื่อมต่อฐานข้อมูล (แนะนำให้แยกไฟล์ config สำหรับข้อมูลฐานข้อมูล)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'project',
});

const multer = require('multer');
const storage = multer.memoryStorage(); // เก็บไฟล์ในหน่วยความจำชั่วคราว
const upload = multer({ storage: storage });


app.post('/register', jsonParser, (req, res) => {
  const { R_username, email, Password, R_Tel, R_Name } = req.body;

  // ตรวจสอบค่าว่าง
  if (!R_username || !email || !Password || !R_Tel || !R_Name) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  connection.execute(
    'INSERT INTO role (R_username, email, Password, R_Tel, R_Name) VALUES (?, ?, ?, ?, ?)',
    [R_username, email, Password, R_Tel, R_Name],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ status: 'error', message: 'Username or email already exists' });
        } else {
          return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
      }
      res.json({ status: 'ok', message: 'Registration successful' });
    }
  );
});

app.post('/login', jsonParser, (req, res) => {
  const { email, Password } = req.body;

  if (!email || !Password) {
    return res.json({ status: 'error', message: 'Email and password are required' });
  }

  connection.execute(
    'SELECT * FROM role WHERE email = ?',
    [email],
    (err, users) => {
      if (err) {
        return res.json({ status: 'error', message: 'Database error', detail: err });
      }
      if (users.length === 0) {
        return res.json({ status: 'error', message: 'User not found' });
      }
      const user = users[0];

      // ตรวจสอบรหัสผ่าน
      if (user.Password === Password) {
        var token = jwt.sign({ email: user.email, role: user.R_Name }, secret, { expiresIn: '1h' });
        return res.json({ status: 'ok', message: 'Login success', token, role: user.R_Name });
      } else {
        return res.json({ status: 'error', message: 'Incorrect password' });
      }
    }
  );
});

app.post('/authen', jsonParser, (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});


app.post('/addmenu', upload.single('Menu_picture'), (req, res) => {
  const { Menu_name, Menu_price, Menu_category } = req.body;
  const Menu_picture = req.file.buffer; // รับข้อมูลรูปภาพจาก request

  connection.execute(
    'INSERT INTO menu (Menu_name, Menu_price, Menu_category, Menu_picture) VALUES (?, ?, ?, ?)',
    [Menu_name, Menu_price, Menu_category, Menu_picture],
    (err, results) => {
      if (err) {
        console.error('Error adding menu:', err);
        res.json({ status: 'error', message: err.message });
        return;
      }
      res.json({ status: 'ok' });
    }
  );
});

app.get('/getmenu', (req, res) => {
  connection.query('SELECT * FROM menu WHERE is_active = TRUE', (err, results) => {
    if (err) {
      console.error('Error fetching menu items:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const processedResults = results.map(item => ({
      ...item,
      Menu_picture: item.Menu_picture.toString('base64')
    }));
    res.json(processedResults);
  });
});


app.get('/getmenu/:id', (req, res) => {
  const menuId = req.params.id;
  connection.query('SELECT * FROM menu WHERE Menu_id = ?', [menuId], (err, results) => {
    if (err) {
      console.error('Error fetching menu item:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }
    const processedResult = {
      ...results[0],
      Menu_picture: results[0].Menu_picture.toString('base64')
    };
    res.json(processedResult);
  });
});


app.put('/updatenoodlemenu/:id', jsonParser, (req, res) => {
  const menuId = req.params.id;
  const { Noodle_menu_name, Noodle_menu_price, Soup_id, Size_id, Meat_id, Noodle_type_id, Noodle_menu_picture } = req.body;

  let query = 'UPDATE noodle_menu SET Noodle_menu_name = ?, Noodle_menu_price = ?, Soup_id = ?, Size_id = ?, Meat_id = ?, Noodle_type_id = ?';
  let params = [Noodle_menu_name, Noodle_menu_price, Soup_id, Size_id, Meat_id, Noodle_type_id];

  if (Noodle_menu_picture) {
    query += ', Noodle_menu_picture = ?';
    params.push(Buffer.from(Noodle_menu_picture, 'base64'));
  }

  query += ' WHERE Noodle_menu_id = ?';
  params.push(menuId);

  connection.execute(query, params, (err, result) => {
    if (err) {
      console.error('Error updating menu:', err);
      res.status(500).json({ status: 'error', message: err.message });
      return;
    }
    res.json({ status: 'ok', message: 'Menu updated successfully' });
  });
});

app.get('/getnoodlemenu', (req, res) => {
  connection.query('SELECT * FROM noodle_menu', (err, results) => {
    if (err) {
      console.error('Error fetching noodle menu items:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    console.log('Raw results:', results); // Log ผลลัพธ์ดิบเพื่อตรวจสอบ

    const processedResults = results.map(item => {
      // ตรวจสอบว่า Noodle_menu_picture มีค่าและเป็น Buffer หรือไม่
      const pictureBase64 = item.Noodle_menu_picture && Buffer.isBuffer(item.Noodle_menu_picture)
        ? item.Noodle_menu_picture.toString('base64')
        : null;

      return {
        ...item,
        Noodle_menu_picture: pictureBase64
      };
    });

    console.log('Processed results:', processedResults); // Log ผลลัพธ์ที่ประมวลผลแล้ว

    res.json(processedResults);
  });
});


app.get('/getnoodlemenu/:id', (req, res) => {
  const menuId = req.params.id;
  connection.query('SELECT * FROM noodle_menu WHERE Noodle_menu_id = ?', [menuId], (err, results) => {
    if (err) {
      console.error('Error fetching menu item:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }
    const result = results[0];
    const processedResult = {
      ...result,
      Noodle_menu_picture: result.Noodle_menu_picture ? result.Noodle_menu_picture.toString('base64') : null
    };
    res.json(processedResult);
  });
});




app.get('/getem', (req, res) => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) {
      console.error('Error fetching employees', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});


app.get('/getem/:id', (req, res) => {
  const employeeId = req.params.id;
  connection.query("SELECT * FROM role WHERE R_id = ?", [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee details', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(results[0]);
  });
});

app.post('/addem', upload.none(), (req, res) => {
  const { R_username, email, Password, R_Tel, R_Name } = req.body;

  // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!R_username || !email || !Password || !R_Tel || !R_Name) {
    return res.status(400).json({ status: 'error', message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const query = 'INSERT INTO role (R_username, email, Password, R_Tel, R_Name) VALUES (?, ?, ?, ?, ?)';

  connection.execute(query, [R_username, email, Password, R_Tel, R_Name], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มพนักงาน:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ status: 'error', message: 'อีเมลนี้มีอยู่ในระบบแล้ว' });
      }
      return res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }

    res.json({ status: 'ok', message: 'เพิ่มพนักงานสำเร็จ', id: results.insertId });
  });
});


app.put('/updateem/:id', (req, res) => {
  const employeeId = req.params.id;
  const { R_username, email, password, R_Tel, R_Name } = req.body;

  console.log('Received data:', req.body);  // เพิ่ม logging

  // ตรวจสอบว่า R_Tel ไม่เป็น undefined หรือ null
  if (R_Tel === undefined || R_Tel === null) {
    return res.status(400).json({ status: 'error', message: 'R_Tel is required' });
  }

  const query = "UPDATE role SET R_username = ?, email = ?, password = ?, R_Tel = ?, R_Name = ? WHERE R_id = ?";
  connection.query(query, [R_username, email, password, R_Tel, R_Name, employeeId], (err, results) => {
    if (err) {
      console.error('Error updating employee', err);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
      return;
    }
    res.json({ status: 'ok', message: 'Employee updated successfully' });
  });
});


app.delete('/deleteemployee/:id', (req, res) => {
  const employeeId = req.params.id;

  const query = "DELETE FROM role WHERE R_id = ?";
  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error deleting employee', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});





app.put('/deletemenu/:id', (req, res) => {
  const menuId = req.params.id;
  const query = 'UPDATE menu SET is_active = FALSE WHERE Menu_id = ?';

  connection.execute(query, [menuId], (error, results) => {
    if (error) {
      console.error('Error soft deleting menu:', error);
      return res.status(500).json({ status: 'error', message: 'An error occurred while soft deleting the menu' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Menu not found' });
    }

    res.json({ status: 'ok', message: 'Menu soft deleted successfully' });
  });
});


app.delete('/deletenoodlemenu/:id', (req, res) => {
  const menuId = req.params.id;
  
  // ตรวจสอบว่ามีการใช้เมนูนี้ใน order_detail หรือไม่
  const checkOrderQuery = 'SELECT * FROM order_detail WHERE Noodle_menu_id = ?';
  connection.query(checkOrderQuery, [menuId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking order details:', checkErr);
      return res.status(500).json({ status: 'error', message: 'An error occurred while checking order details' });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Cannot delete this menu as it is used in orders' });
    }

    // ถ้าไม่มีการใช้ในออเดอร์ ทำการลบ
    const deleteQuery = 'DELETE FROM noodle_menu WHERE Noodle_menu_id = ?';
    connection.query(deleteQuery, [menuId], (deleteErr, deleteResults) => {
      if (deleteErr) {
        console.error('Error deleting noodle menu:', deleteErr);
        return res.status(500).json({ status: 'error', message: 'An error occurred while deleting the noodle menu' });
      }

      if (deleteResults.affectedRows === 0) {
        return res.status(404).json({ status: 'error', message: 'Noodle menu not found' });
      }

      res.json({ status: 'ok', message: 'Noodle menu deleted successfully' });
    });
  });
});


app.post('/addnoodlemenu', upload.single('Noodle_menu_picture'), (req, res) => {
  const { Noodle_menu_name, Noodle_menu_price, Soup_id, Size_id, Meat_id, Noodle_type_id } = req.body;
  const Noodle_menu_picture = req.file ? req.file.buffer : null;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!Noodle_menu_name || !Noodle_menu_price || !Soup_id || !Size_id || !Meat_id || !Noodle_type_id) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  // ตรวจสอบว่ามีชื่อเมนูซ้ำหรือไม่
  const checkDuplicateQuery = 'SELECT * FROM noodle_menu WHERE Noodle_menu_name = ?';
  
  connection.query(checkDuplicateQuery, [Noodle_menu_name], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking for duplicate noodle menu:', checkErr);
      return res.status(500).json({ status: 'error', message: 'An error occurred while checking for duplicate noodle menu' });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ status: 'duplicate', message: 'This noodle menu already exists' });
    }

    // ไม่พบข้อมูลซ้ำ ทำการ insert
    const insertQuery = `
      INSERT INTO noodle_menu 
      (Noodle_menu_name, Noodle_menu_price, Noodle_menu_picture, Soup_id, Size_id, Meat_id, Noodle_type_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      insertQuery,
      [Noodle_menu_name, Noodle_menu_price, Noodle_menu_picture, Soup_id, Size_id, Meat_id, Noodle_type_id],
      (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Error adding noodle menu:', insertErr);
          return res.status(500).json({ status: 'error', message: 'An error occurred while adding the noodle menu' });
        }
        res.status(201).json({ status: 'ok', message: 'Noodle menu added successfully', id: insertResults.insertId });
      }
    );
  });
});



app.post('/addmeat', jsonParser, (req, res) => {
  const { meat } = req.body;

  if (!meat) {
    return res.status(400).json({ status: 'error', message: 'Meat name is required' });
  }

  const checkDuplicateQuery = 'SELECT * FROM meat WHERE Meat_name = ?';

  connection.query(checkDuplicateQuery, [meat], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking for duplicate meat:', checkErr);
      return res.status(500).json({ status: 'error', message: 'An error occurred while checking for duplicate meat' });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ status: 'duplicate', message: 'This meat type already exists' });
    }

    const insertQuery = 'INSERT INTO meat (Meat_name) VALUES (?)';

    connection.query(insertQuery, [meat], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error adding meat:', insertErr);
        return res.status(500).json({ status: 'error', message: 'An error occurred while adding the meat' });
      }

      res.status(201).json({ status: 'ok', message: 'Meat added successfully', id: insertResults.insertId });
    });
  });
});

app.post('/addsize', (req, res) => {
  const { size } = req.body;

  if (!size) {
    return res.status(400).json({ status: 'error', message: 'Size is required' });
  }

  const checkDuplicateQuery = 'SELECT * FROM size WHERE Size_name = ?';

  connection.query(checkDuplicateQuery, [size], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking for duplicate size:', checkErr);
      return res.status(500).json({ status: 'error', message: 'An error occurred while checking for duplicate size' });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ status: 'duplicate', message: 'This size already exists' });
    }

    const insertQuery = 'INSERT INTO size (Size_name) VALUES (?)';

    connection.query(insertQuery, [size], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error adding size:', insertErr);
        return res.status(500).json({ status: 'error', message: 'An error occurred while adding the size' });
      }

      res.status(201).json({ status: 'ok', message: 'Size added successfully', id: insertResults.insertId });
    });
  });
});

app.post('/addsoup', jsonParser, (req, res) => {
  const { soup } = req.body;

  if (!soup) {
    return res.status(400).json({ status: 'error', message: 'Soup is required' });
  }

  const checkDuplicateQuery = 'SELECT * FROM soup WHERE Soup_name = ?';

  connection.query(checkDuplicateQuery, [soup], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking for duplicate meat:', checkErr);
      return res.status(500).json({ status: 'error', message: 'An error occurred while checking for duplicate meat' });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ status: 'duplicate', message: 'This meat type already exists' });
    }

    const insertQuery = 'INSERT INTO soup (Soup_name) VALUES (?)';

    connection.query(insertQuery, [soup], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error adding soup:', insertErr);
        return res.status(500).json({ status: 'error', message: 'An error occurred while adding the soup' });
      }

      res.status(201).json({ status: 'ok', message: 'Soup added successfully', id: insertResults.insertId });
    });
  })
});

app.get('/soups', (req, res) => {
  connection.query('SELECT * FROM soup', (err, results) => {
    if (err) {
      console.error('Error fetching soups:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// GET all sizes
app.get('/sizes', (req, res) => {
  connection.query('SELECT * FROM size', (err, results) => {
    if (err) {
      console.error('Error fetching sizes:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// GET all meats
app.get('/meats', (req, res) => {
  connection.query('SELECT * FROM meat', (err, results) => {
    if (err) {
      console.error('Error fetching meats:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// GET all noodle types
app.get('/noodletypes', (req, res) => {
  console.log('Fetching noodle types...');
  connection.query('SELECT * FROM noodle_type', (err, results) => {
    if (err) {
      console.error('Error fetching noodle types:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Noodle types fetched:', JSON.stringify(results, null, 2));
    res.json(results);
  });
});



app.post('/addnoodlemenu', upload.single('Noodle_menu_picture'), (req, res) => {
  console.log('Received data:', req.body);
  console.log('Received file:', req.file);
  const { Noodle_menu_name, Noodle_menu_price, Soup_id, Size_id, Meat_id, Noodle_type_id } = req.body;
  const Noodle_menu_picture = req.file ? req.file.buffer : null;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!Noodle_menu_name || !Noodle_menu_price || !Soup_id || !Size_id || !Meat_id || !Noodle_type_id) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO noodle_menu 
    (Noodle_menu_name, Noodle_menu_price, Noodle_menu_picture, Soup_id, Size_id, Meat_id, Noodle_type_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.execute(
    query,
    [Noodle_menu_name, Noodle_menu_price, Noodle_menu_picture, Soup_id, Size_id, Meat_id, Noodle_type_id],
    (err, results) => {
      if (err) {
        console.error('Error adding noodle menu:', err);
        res.status(500).json({ status: 'error', message: 'An error occurred while adding the noodle menu', error: err.message });
        return;
      }
      res.json({ status: 'ok', message: 'Noodle menu added successfully', id: results.insertId });
    }
  );
});

app.delete('/deletenoodletype/:id', (req, res) => {
  const noodleTypeId = req.params.id;

  const query = 'DELETE FROM noodle_type WHERE Noodle_type_id = ?';

  connection.execute(query, [noodleTypeId], (error, results) => {
    if (error) {
      console.error('Error deleting noodle type:', error);
      res.status(500).json({ status: 'error', message: 'An error occurred while deleting the noodle type' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Noodle type not found' });
      return;
    }

    res.json({ status: 'ok', message: 'Noodle type deleted successfully' });
  });
});
app.delete('/deleteMeat/:id', (req, res) => {
  const meatId = req.params.id;

  const query = 'DELETE FROM meat WHERE Meat_id = ?';

  connection.execute(query, [meatId], (error, results) => {
    if (error) {
      console.error('Error deleting noodle type:', error);
      res.status(500).json({ status: 'error', message: 'An error occurred while deleting the noodle type' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Noodle type not found' });
      return;
    }

    res.json({ status: 'ok', message: 'Noodle type deleted successfully' });
  });
});
app.delete('/deletesize/:id', (req, res) => {
  const sizeId = req.params.id;

  const query = 'DELETE FROM size WHERE Size_id = ?';

  connection.execute(query, [sizeId], (error, results) => {
    if (error) {
      console.error('Error deleting noodle type:', error);
      res.status(500).json({ status: 'error', message: 'An error occurred while deleting the noodle type' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Noodle type not found' });
      return;
    }

    res.json({ status: 'ok', message: 'Noodle type deleted successfully' });
  });
});
app.delete('/deletesoup/:id', (req, res) => {
  const soupId = req.params.id;

  const query = 'DELETE FROM soup WHERE Soup_id = ?';

  connection.execute(query, [soupId], (error, results) => {
    if (error) {
      console.error('Error deleting noodle type:', error);
      res.status(500).json({ status: 'error', message: 'An error occurred while deleting the noodle type' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Noodle type not found' });
      return;
    }

    res.json({ status: 'ok', message: 'Noodle type deleted successfully' });
  });
});

app.get('/getorders', (req, res) => {
  connection.query('SELECT * FROM `order`', (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

/*
app.get('/getorder/:id', (req, res) => {
  const orderId = req.params.id;
  connection.query('SELECT * FROM `order` WHERE Order_id = ?', [orderId], (err, results) => {
    if (err) {
      console.error('Error fetching order:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(results[0]);
  });
})
*/

app.get('/getorderdetail/:id', (req, res) => {
  const orderId = req.params.id;
  const query = `
    SELECT od.*, 
           COALESCE(m.Menu_name, nm.Noodle_menu_name) AS Item_name
    FROM order_detail od
    LEFT JOIN menu m ON od.Menu_id = m.Menu_id
    LEFT JOIN noodle_menu nm ON od.Noodle_menu_id = nm.Noodle_menu_id
    WHERE od.Order_id = ?
  `;

  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Error fetching order details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Order details not found' });
      return;
    }

    const processedResults = results.map(item => ({
      ...item,
      Item_name: item.Item_name || 'Unknown Item'
    }));

    res.json(processedResults);
  });
});

app.put('/updateorderstatus/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE order_detail SET Order_detail_status = ? WHERE Order_detail_id = ?';

  connection.query(query, [status, id], (error, results) => {
    if (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'An error occurred while updating the order status' });
      return;
    }
    res.json({ message: 'Order status updated successfully' });
  });
});

app.get('/getactiveorders', (req, res) => {
  const query = `
    SELECT o.*,
           COUNT(od.Order_detail_id) AS total_items,
           SUM(CASE WHEN od.Order_detail_status != 'เสิร์ฟแล้ว' THEN 1 ELSE 0 END) AS pending_items
    FROM \`order\` o
    JOIN order_detail od ON o.Order_id = od.Order_id
    GROUP BY o.Order_id
    HAVING pending_items > 0
    ORDER BY o.Order_datetime DESC
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching active orders:', error);
      res.status(500).json({ error: 'An error occurred while fetching orders' });
      return;
    }

    res.json(results);
  });
});


app.get('/getpartiallyservedorders', (req, res) => {
  const query = `
    SELECT o.*, 
           COUNT(od.Order_detail_id) AS total_items,
           SUM(CASE WHEN od.Order_detail_status = 'พร้อมเสิร์ฟ' THEN 1 ELSE 0 END) AS served_items
    FROM \`order\` o
    JOIN order_detail od ON o.Order_id = od.Order_id
    GROUP BY o.Order_id
    HAVING served_items > 0
    ORDER BY o.Order_datetime DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching partially served orders:', error);
      res.status(500).json({ error: 'An error occurred while fetching partially served orders' });
      return;
    }

    res.json(results);
  });
});

app.put('/updateorderstatustoserved/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE order_detail SET Order_detail_status = ? WHERE Order_detail_id = ?';

  connection.query(query, [status, id], (error, results) => {
    if (error) {
      console.error('Error updating order status to served:', error);
      res.status(500).json({ error: 'An error occurred while updating the order status' });
      return;
    }
    res.json({ message: 'Order status updated to served successfully' });
  });
});

app.get('/getfullyservedorders', (req, res) => {
  const query = `
    SELECT o.*, 
           COUNT(od.Order_detail_id) AS total_items
    FROM \`order\` o
    JOIN order_detail od ON o.Order_id = od.Order_id
    GROUP BY o.Order_id
    HAVING COUNT(od.Order_detail_id) = SUM(CASE WHEN od.Order_detail_status = 'เสิร์ฟแล้ว' THEN 1 ELSE 0 END)
    ORDER BY o.Order_datetime DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching fully served orders:', error);
      res.status(500).json({ error: 'An error occurred while fetching fully served orders' });
      return;
    }

    res.json(results);
  });
});


app.get('/getpreparingorders', (req, res) => {
  const query = `
    SELECT o.*, 
           COUNT(od.Order_detail_id) AS total_items,
           SUM(CASE WHEN od.Order_detail_status = 'กำลังจัดเตรียม' THEN 1 ELSE 0 END) AS preparing_items
    FROM \`order\` o
    JOIN order_detail od ON o.Order_id = od.Order_id
    GROUP BY o.Order_id
    HAVING preparing_items > 0
    ORDER BY o.Order_datetime DESC
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching preparing orders:', error);
      res.status(500).json({ error: 'An error occurred while fetching preparing orders' });
      return;
    }

    res.json(results);
  });
});
/*
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});
*/
app.listen(3333, () => {
  console.log('CORS-enabled web server listening on port 3333');
});
