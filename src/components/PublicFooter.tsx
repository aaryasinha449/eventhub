import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The premium event management platform for organizers who care about craft.
              Sell tickets, check in attendees, and run your numbers — all in one place.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/events" className="text-foreground/80 hover:text-foreground">Browse events</Link></li>
              <li><Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="text-foreground/80 hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/login" className="text-foreground/80 hover:text-foreground">Sign in</Link></li>
              <li><Link to="/signup" className="text-foreground/80 hover:text-foreground">Create account</Link></li>
              <li><Link to="/forgot-password" className="text-foreground/80 hover:text-foreground">Forgot password</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
          <p>Crafted with care. Noir & Gold edition.</p>
        </div>
      </div>
    </footer>
  );
}
