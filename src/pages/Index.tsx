const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="flex-1 flex items-center justify-center">
        <h1>Gudini Chat - Main Page</h1>
        <p>React is working!</p>
      </div>
    </div>
  );
};
