# Tests the settings function in api.py. Written using Claude 3.5

@pytest.fixture
def client(app):
    app.register_blueprint(base_blueprint)
    return app.test_client()

@pytest.fixture
def mock_account():
    account = MagicMock(spec=Account)
    account.displayname = "TestUser"
    account.userdata = {}
    return account

@pytest.fixture
def mock_db_session(monkeypatch):
    session = MagicMock()
    monkeypatch.setattr(db, 'session', session)
    return session

def test_delete_account(client, mock_account, mock_db_session):
    with patch('twidilers.base.api.findAccount', return_value=mock_account):
        response = client.post('/settings', data={'delete': 'true'})
        
        mock_db_session.delete.assert_called_once_with(mock_account)
        mock_db_session.commit.assert_called_once()
        assert response.status_code == 302
        assert response.headers['Location'].endswith('/logout')

def test_change_password_success(client, mock_account, mock_db_session):
    mock_account.check_password.return_value = True
    with patch('twidilers.base.api.findAccount', return_value=mock_account):
        response = client.post('/settings', data={
            'new-password': 'newpass',
            'old-password': 'oldpass'
        })
        
        assert mock_account.password == 'newpass'
        mock_db_session.commit.assert_called_once()
        assert response.status_code == 302
        assert response.headers['Location'].endswith('/settings')

def test_change_password_wrong_current(client, mock_account):
    mock_account.check_password.return_value = False
    with patch('twidilers.base.api.findAccount', return_value=mock_account):
        response = client.post('/settings', data={
            'new-password': 'newpass',
            'old-password': 'wrongpass'
        })
        
        assert response.status_code == 302
        assert response.headers['Location'].endswith('/settings')

def test_change_display_name(client, mock_account, mock_db_session):
    with patch('twidilers.base.api.findAccount', return_value=mock_account):
        with patch('twidilers.base.api.save') as mock_save: