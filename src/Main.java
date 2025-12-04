public class Main {
  public static void main(String... args) {
    int cnt = 0;
    while (true) {
      if (cnt++ > 10) {
        return;
      }
      try {
        throw new Throwable();
      } catch (Throwable t) {
        continue;
      } finally {
        System.out.println("Zirota privet!!");
      }
    }
  }
}
