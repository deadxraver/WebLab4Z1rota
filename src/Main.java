public class Main {
  public static void main(String... args) {
    while (true) {
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
