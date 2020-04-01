import os
import unittest

from app import db, app

TEST_DB = "test.db"


class BasicTestCase(unittest.TestCase):
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get("/", content_type="html/text")
        self.assertEqual(response.status_code, 200)  # GET Request

    def test_database(self):
        tester = os.path.exists("flaskr.db")
        self.assertTrue(tester)


class FlaskrTestCase(unittest.TestCase):
    def setUp(self):
        " Set up a blank db before each test "
        basedir = os.path.abspath(os.path.dirname(__file__))
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
            basedir, TEST_DB
        )
        self.app = app.test_client()
        db.create_all()

    def tearDown(self):
        " Destroy temp database after each test "
        db.drop_all()

    def login(self, username, password):
        " Login "
        return self.app.post(
            "/login",
            data=dict(username=username, password=password),
            follow_redirects=True,
        )

    def logout(self):
        " Logout "
        return self.app.get("/logout", follow_redirects=True)

    def test_empty_db(self):
        " Ensure db is empty "
        tmp = self.app.get("/")
        assert b"No entries here so far" in tmp.data

    def test_login_logout(self):
        tmp = self.login(app.config["USERNAME"], app.config["PASSWORD"])
        assert b"You were logged in" in tmp.data
        tmp = self.logout()
        assert b"You were logged out" in tmp.data
        tmp = self.login(app.config["USERNAME"] + "x", app.config["PASSWORD"])
        assert b"Invalid username" in tmp.data
        tmp = self.login(app.config["USERNAME"], app.config["PASSWORD"] + "x")
        assert b"Invalid password" in tmp.data

    def test_messages(self):
        " Ensure User can POST "
        self.login(app.config["USERNAME"], app.config["PASSWORD"])
        tmp = self.app.post(
            "/add",
            data=dict(title="<Hello>", text="<strong>HTML</strong> allowed here !"),
            follow_redirects=True,
        )

        assert b"No entries here so far" not in tmp.data
        assert b"&lt;Hello&gt;" in tmp.data
        assert b"<strong>HTML</strong> allowed here !" in tmp.data

    def test_delete_messages(self):
        import json

        " Ensure User can Delete Posts "
        tmp = self.app.get("/delete/1")
        data = json.loads((tmp.data).decode("utf-8"))
        self.assertEqual(data["status"], 0)
        self.login(app.config["USERNAME"], app.config["PASSWORD"])
        tmp = self.app.get("/delete/1")
        data = json.loads((tmp.data).decode("utf-8"))
        self.assertEqual(data["status"], 1)

    def test_search(self):
        return self.app.get(
            "/search", data=dict(query="<Hello>"), follow_redirects=True
        )


if __name__ == "__main__":
    unittest.main()
