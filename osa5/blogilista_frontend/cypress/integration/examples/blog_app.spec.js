describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Teemu Teekkari',
      username: 'User1',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('User1')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Teemu Teekkari is logged in')
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type('User1')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'User1', password: 'password'
      }).then(response => {
        localStorage.setItem('loggedUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      cy.get('#title').type('Blog title')
      cy.get('#author').type('Blog author')
      cy.get('#url').type('https://www.google.com')
      cy.get('#create-button').click()
      cy.contains('Blog title Blog author')
    })

    describe('and a blog exists', function () {

      beforeEach(function () {
        cy.createBlog({
          title: 'first blog',
          author: 'Another author',
          url: 'https://www.bing.com'
        })
      })
      it('A blog can be liked', function() {
        cy.get('#info-button').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('A blog can be deleted', function() {
        cy.get('#info-button').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'first blog Another author')
      })

      it('blogs are sorted by likes', function() {
        cy.createBlog({
          title: 'second blog',
          author: 'famous author',
          url: 'https://www.test.com'
        })
        cy.contains('second blog').parent().find('#info-button').click()
        cy.contains('second blog').parent().find('#like-button').click()
        cy.contains('close').click()
        cy.get('#shortInfo:first').should('contain', 'second blog famous author')
      })
    })
  })
})



