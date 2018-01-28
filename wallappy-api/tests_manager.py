import os
import tarfile
import sqlite3


class TestsManager(object):
    def __init__(self, app_config):
        self._config = app_config
        self._setup_db()


    def _setup_db(self):
        print "Setting up DB"
        db_path = self._config.db_path()
        if not os.path.exists(db_path):
            os.makedirs(db_path)
        self._conn = sqlite3.connect(db_path + '/wallappy.db')

        c = self._conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS tests_results (
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, 
                app text, 
                env text, 
                version text
            )''')
    
    def _close_db(self):
        print "Closing DB connection"
        self._conn.close()

    def save_results(self, app, env, version, results): 
        results_dir = self._config.tests_path() + "/" + app + "/" +  env + "/" + version 
        if not os.path.exists(results_dir):
            os.makedirs(results_dir)
        results_path = results_dir + "/results.tar.gz"
        results.save(results_path)

        tar = tarfile.open(results_path, "r:gz")
        tar.extractall()
        tar.close()
        os.remove(results_path)
        print "Tests results stored at " + results_dir

        self._register_results(app, env, version)
        print "Tests results saved in DB"

    def _register_results(self, app, env, version):
        print 'Storing results'
        cur = self._conn.cursor()
        cur.execute("INSERT INTO tests_results(app, env, version) VALUES (?, ?, ?)", (app, env, version))
        self._conn.commit()

        for row in cur.execute("SELECT * FROM tests_results ORDER BY timestamp DESC"):
            print row


    def __exit__(self, type, value, traceback):
        self._close_db()

    def __del__(self):
        self._close_db()
