# Add ons/Dynos

`heroku addons:create auth0:free`

`heroku addons:create snyk:free`

## Automated Certificate Management

- Heroku automatically manages TLS certificates for apps with Hobby and Professional dynos on the Common Runtime, and for apps in Private Spaces that enable the feature.

https://devcenter.heroku.com/articles/automated-certificate-management

- enable ACM w/ app upgrade to Hobby or Professional dynos:

`heroku ps:resize web=hobby`

`heroku certs:auto:enable`

- `note`:

  - ensure that your DNS is `pointed at its new DNS target`. `If` it’s pointed at `*.herokuapp.com or *.herokussl.com`, Heroku is `unable to verify your certificate`. Run `heroku domains` to verify the DNS target.

## Heroku Pricing

https://www.heroku.com/pricing


