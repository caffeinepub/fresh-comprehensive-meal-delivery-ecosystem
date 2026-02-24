module {
  type Actor = {
    stripeConfiguration : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
